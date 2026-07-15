import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/data/site';
import { FluidBackdrop } from './fluid-backdrop';

export function Hero() {
  return (
    <FluidBackdrop>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">
            Hello — welcome to my corner of the internet
          </p>
          <h1 className="display">
            我是 <em>original</em>
          </h1>
          <p className="hero-role">
            一名探索代码、系统与想法的研究者和开发者。
          </p>
          <div className="hero-notes">
            <section>
              <h2>关于这里</h2>
              <p>
                这是一个使用示例内容搭建的个人数字花园。我会在这里整理技术实验、项目过程，以及那些尚未完全成形的思考。
              </p>
            </section>
            <section>
              <h2>写给你</h2>
              <p>
                所有文字与项目目前都是占位内容，但网站的结构、动效与发布流程已经为长期写作准备好。
              </p>
            </section>
          </div>
          <p className="hero-welcome">
            欢迎来到我的 <span>小小世界</span>。
          </p>
        </div>

        <div className="hero-bottom">
          <div className="hero-socials">
            {siteConfig.socials.map((item) => (
              <a key={item.label} href={item.href} rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
          <p>Shanghai · UTC+8</p>
        </div>
        <Link className="scroll-cue" href="#intro" aria-label="向下浏览">
          <span>Scroll</span>
          <ArrowDown aria-hidden="true" />
        </Link>
      </div>
    </FluidBackdrop>
  );
}
