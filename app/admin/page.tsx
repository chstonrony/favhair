"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, publicImageUrl, GALLERY_BUCKET } from "../lib/supabase-config";
import type { PhotoRow } from "../lib/supabase";

type AdminPhoto = {
  id: string;
  title: string;
  subtitle: string;
  storagePath: string;
  sortOrder: number;
};

type UploadState = {
  name: string;
  status: "대기 중" | "사진 줄이는 중" | "올리는 중" | "완료" | "실패";
  error?: string;
};

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

function koreanAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (lower.includes("email not confirmed")) return "아직 인증되지 않은 이메일입니다.";
  if (lower.includes("rate limit") || lower.includes("too many")) return "잠시 후 다시 시도해주세요.";
  if (lower.includes("failed to fetch") || lower.includes("network")) return "인터넷 연결을 확인해주세요.";
  return "로그인에 실패했습니다. 다시 시도해주세요.";
}

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // 일부 브라우저는 옵션을 지원하지 않습니다. 아래 방식으로 대체합니다.
    }
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("사진을 읽을 수 없습니다."));
    };
    image.src = url;
  });
}

/** 휴대폰 사진을 긴 변 1600px로 줄이고 JPEG으로 압축합니다. */
async function shrinkImage(file: File): Promise<Blob> {
  const source = await loadImage(file);
  const width = "naturalWidth" in source ? source.naturalWidth || source.width : source.width;
  const height = "naturalHeight" in source ? source.naturalHeight || source.height : source.height;
  const ratio = Math.min(1, MAX_EDGE / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * ratio));
  const targetHeight = Math.max(1, Math.round(height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("사진을 처리할 수 없습니다.");
  context.drawImage(source, 0, 0, targetWidth, targetHeight);
  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) source.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });
  if (!blob) throw new Error("사진을 변환할 수 없습니다.");
  return blob;
}

export default function AdminPage() {
  const [configured] = useState(isSupabaseConfigured);
  const [ready, setReady] = useState(() => !isSupabaseConfigured());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [listError, setListError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadPhotos = useCallback(async () => {
    setListError("");
    try {
      const { getSupabase } = await import("../lib/supabase");
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("photos")
        .select("id,title,subtitle,storage_path,sort_order,created_at")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      const rows = (data ?? []) as PhotoRow[];
      setPhotos(
        rows.map((row, index) => ({
          id: row.id,
          title: row.title ?? "",
          subtitle: row.subtitle ?? "",
          storagePath: row.storage_path,
          sortOrder: row.sort_order ?? index,
        })),
      );
    } catch {
      setListError("사진 목록을 불러오지 못했습니다. 새로고침 해주세요.");
    }
  }, []);

  useEffect(() => {
    if (!configured) return;
    let alive = true;
    (async () => {
      try {
        const { getSupabase } = await import("../lib/supabase");
        const supabase = await getSupabase();
        const { data } = await supabase.auth.getSession();
        if (!alive) return;
        if (data.session) {
          setSignedIn(true);
          setAuthEmail(data.session.user.email ?? "");
          await loadPhotos();
        }
      } catch {
        // 로그인 화면을 그대로 보여줍니다.
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [configured, loadPhotos]);

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      const { getSupabase } = await import("../lib/supabase");
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setAuthError(koreanAuthError(error.message));
        return;
      }
      setSignedIn(true);
      setAuthEmail(data.user?.email ?? email.trim());
      setPassword("");
      await loadPhotos();
    } catch (error) {
      setAuthError(koreanAuthError(error instanceof Error ? error.message : ""));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    try {
      const { getSupabase } = await import("../lib/supabase");
      const supabase = await getSupabase();
      await supabase.auth.signOut();
    } catch {
      // 무시하고 화면만 초기화합니다.
    }
    setSignedIn(false);
    setAuthEmail("");
    setPhotos([]);
    setUploads([]);
    setNotice("");
  }

  function updateDraft(id: string, key: "title" | "subtitle", value: string) {
    setPhotos((prev) => prev.map((photo) => (photo.id === id ? { ...photo, [key]: value } : photo)));
  }

  async function handleSave(photo: AdminPhoto) {
    setBusyId(photo.id);
    setNotice("");
    try {
      const { getSupabase } = await import("../lib/supabase");
      const supabase = await getSupabase();
      const { error } = await supabase
        .from("photos")
        .update({ title: photo.title.trim(), subtitle: photo.subtitle.trim() })
        .eq("id", photo.id);
      if (error) throw error;
      setNotice("저장했습니다.");
    } catch {
      setNotice("저장하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(photo: AdminPhoto) {
    if (!window.confirm("이 사진을 삭제할까요? 되돌릴 수 없습니다.")) return;
    setBusyId(photo.id);
    setNotice("");
    try {
      const { getSupabase } = await import("../lib/supabase");
      const supabase = await getSupabase();
      const { error } = await supabase.from("photos").delete().eq("id", photo.id);
      if (error) throw error;
      await supabase.storage.from(GALLERY_BUCKET).remove([photo.storagePath]);
      setPhotos((prev) => prev.filter((item) => item.id !== photo.id));
      setNotice("삭제했습니다.");
    } catch {
      setNotice("삭제하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const reordered = [...photos];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const numbered = reordered.map((photo, position) => ({ ...photo, sortOrder: position }));
    const previousOrder = new Map(photos.map((photo) => [photo.id, photo.sortOrder]));
    const changed = numbered.filter((photo) => previousOrder.get(photo.id) !== photo.sortOrder);

    setPhotos(numbered);
    setBusyId(numbered[target].id);
    setNotice("");
    try {
      const { getSupabase } = await import("../lib/supabase");
      const supabase = await getSupabase();
      for (const photo of changed) {
        const { error } = await supabase
          .from("photos")
          .update({ sort_order: photo.sortOrder })
          .eq("id", photo.id);
        if (error) throw error;
      }
    } catch {
      setNotice("순서를 저장하지 못했습니다. 다시 시도해주세요.");
      await loadPhotos();
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setNotice("");
    setUploads(files.map((file) => ({ name: file.name, status: "대기 중" as const })));

    const setStatus = (index: number, status: UploadState["status"], error?: string) => {
      setUploads((prev) => prev.map((item, i) => (i === index ? { ...item, status, error } : item)));
    };

    try {
      const { getSupabase } = await import("../lib/supabase");
      const supabase = await getSupabase();
      let nextOrder = photos.reduce((max, photo) => Math.max(max, photo.sortOrder), -1) + 1;
      const stamp = Date.now();

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        try {
          setStatus(index, "사진 줄이는 중");
          const blob = await shrinkImage(file);

          setStatus(index, "올리는 중");
          const storagePath = `style-${stamp}-${index}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from(GALLERY_BUCKET)
            .upload(storagePath, blob, { contentType: "image/jpeg", cacheControl: "3600", upsert: false });
          if (uploadError) throw uploadError;

          const { error: insertError } = await supabase
            .from("photos")
            .insert({ title: "", subtitle: "", storage_path: storagePath, sort_order: nextOrder });
          if (insertError) throw insertError;

          nextOrder += 1;
          setStatus(index, "완료");
        } catch (error) {
          setStatus(index, "실패", error instanceof Error ? error.message : undefined);
        }
      }

      await loadPhotos();
      setNotice("사진을 올렸습니다. 이름을 입력하고 저장해주세요.");
    } catch {
      setNotice("사진을 올리지 못했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <span className="admin-brand">
          <img src="/assets/favhair-wordmark-transparent.png" alt="FAV HAIR" />
        </span>
        <span className="admin-header-label">사진 관리</span>
      </header>

      {!ready && <p className="admin-status">불러오는 중…</p>}

      {ready && !configured && (
        <section className="admin-panel">
          <h1 className="admin-title">준비 중입니다</h1>
          <p className="admin-help">
            사진 관리 기능을 연결하는 중이에요. 준비가 끝나면 이 화면에서 바로 사진을 올리고 수정할 수 있습니다.
            잠시만 기다려주세요.
          </p>
        </section>
      )}

      {ready && configured && !signedIn && (
        <section className="admin-panel">
          <h1 className="admin-title">로그인</h1>
          <p className="admin-help">페이브헤어 사진 관리를 위한 로그인 화면입니다.</p>
          <form className="admin-form" onSubmit={handleSignIn}>
            <label className="admin-field">
              <span>이메일</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="이메일 주소"
                required
              />
            </label>
            <label className="admin-field">
              <span>비밀번호</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호"
                required
              />
            </label>
            {authError && <p className="admin-error">{authError}</p>}
            <button className="admin-button primary" type="submit" disabled={authBusy}>
              {authBusy ? "로그인 중…" : "로그인"}
            </button>
          </form>
        </section>
      )}

      {ready && configured && signedIn && (
        <>
          <section className="admin-panel">
            <div className="admin-account">
              <span>{authEmail}</span>
              <button className="admin-button ghost" type="button" onClick={handleSignOut}>
                로그아웃
              </button>
            </div>
          </section>

          <section className="admin-panel">
            <h2 className="admin-section-title">사진 올리기</h2>
            <p className="admin-help">
              휴대폰 사진을 여러 장 한 번에 올릴 수 있어요. 사진은 자동으로 작게 줄여서 올라갑니다.
            </p>
            <label className="admin-upload">
              <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
              <span>{uploading ? "올리는 중…" : "사진 선택하기"}</span>
            </label>
            {uploads.length > 0 && (
              <ul className="admin-upload-list">
                {uploads.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    <span className="admin-upload-name">{item.name}</span>
                    <span className={`admin-upload-status${item.status === "실패" ? " failed" : ""}`}>{item.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {notice && <p className="admin-notice">{notice}</p>}
          {listError && <p className="admin-error">{listError}</p>}

          <section className="admin-panel">
            <h2 className="admin-section-title">등록된 사진 ({photos.length})</h2>
            {photos.length === 0 && !listError && (
              <p className="admin-help">아직 올린 사진이 없습니다. 위에서 사진을 올려주세요.</p>
            )}
            <div className="admin-grid">
              {photos.map((photo, index) => (
                <article className="admin-card" key={photo.id}>
                  <div className="admin-card-photo">
                    <img src={publicImageUrl(photo.storagePath)} alt={photo.title || "등록된 사진"} loading="lazy" />
                    <span className="admin-card-order">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <label className="admin-field">
                    <span>스타일 이름</span>
                    <input
                      type="text"
                      value={photo.title}
                      onChange={(event) => updateDraft(photo.id, "title", event.target.value)}
                      placeholder="예) 소프트 브라운 레이어드"
                    />
                  </label>
                  <label className="admin-field">
                    <span>영문 부제</span>
                    <input
                      type="text"
                      value={photo.subtitle}
                      onChange={(event) => updateDraft(photo.id, "subtitle", event.target.value)}
                      placeholder="예) SOFT BROWN LAYERED"
                    />
                  </label>
                  <div className="admin-card-actions">
                    <button
                      className="admin-button primary"
                      type="button"
                      onClick={() => handleSave(photo)}
                      disabled={busyId === photo.id}
                    >
                      저장
                    </button>
                    <button
                      className="admin-button danger"
                      type="button"
                      onClick={() => handleDelete(photo)}
                      disabled={busyId === photo.id}
                    >
                      삭제
                    </button>
                    <button
                      className="admin-button icon"
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0 || busyId !== null}
                      aria-label="위로 옮기기"
                    >
                      ▲
                    </button>
                    <button
                      className="admin-button icon"
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === photos.length - 1 || busyId !== null}
                      aria-label="아래로 옮기기"
                    >
                      ▼
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
