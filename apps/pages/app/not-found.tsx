import Link from 'next/link';
import '@/components/listing.css';

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <strong>404</strong>
      <h1>这条路还没有内容。</h1>
      <p>页面可能被移动了，或者它只是一个尚未写下的想法。</p>
      <Link href="/">回到首页</Link>
    </main>
  );
}
