// 배포 후 아래 두 값을 Supabase 프로젝트 값으로 교체하세요.
export const SUPABASE_URL = "https://crewzpxnwrhtdgsbdlyr.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_SFA55C4086SaK9yKKQMznA_zl-SDwa6";

export const GALLERY_BUCKET = "gallery";

/** 설정이 아직 자리표시자 그대로인지 여부. (번들러가 미리 계산하지 못하도록 런타임에서 판별) */
export function isSupabaseConfigured(): boolean {
  const mark = ["_", "_SUPABASE"].join("");
  return (
    !SUPABASE_URL.includes(mark) &&
    !SUPABASE_ANON_KEY.includes(mark) &&
    SUPABASE_URL.startsWith("http")
  );
}

/** 스토리지에 올라간 파일의 공개 이미지 주소. */
export function publicImageUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${storagePath}`;
}
