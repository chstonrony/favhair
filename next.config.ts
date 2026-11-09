import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 문자 속 짧은 주소 /hub 를 정적 허브 페이지로 연결한다.
    return [{ source: "/hub", destination: "/hub/index.html" }];
  },
};

export default nextConfig;
