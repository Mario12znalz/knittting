"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id: string; title: string; description: string; price: number; tag: string; kind: string };
const demoProducts: Product[] = [
  { id: "kit", title: "The Sunday Project Kit", description: "A roomy, yarn-friendly bag with space for your everyday notions.", price: 49, tag: "Bestseller-to-be", kind: "bag" },
  { id: "guide", title: "Yarn Guide Duo", description: "Two smooth guides to keep your yarn feeding neatly as you work.", price: 12, tag: "Little helper", kind: "skein" },
  { id: "bundle", title: "The Tangle-Free Bundle", description: "The project kit plus yarn guides — a calmer setup in one go.", price: 55, tag: "Bundle & save", kind: "yarn" },
];
const euro = (n: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

export default function Home() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = useMemo(() => products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0), [products, cart]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (!base || !key) return;
    fetch(`${base.replace(/\/$/, "")}/store/products?limit=12&region_id=${encodeURIComponent(process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || "")}`, {
      headers: { "x-publishable-api-key": key },
      cache: "no-store",
    }).then(async (res) => {
      if (!res.ok) throw new Error("Medusa product request failed");
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length) {
        const mapped = data.products.map((p: any) => ({
          id: p.id,
          title: p.title || "Maker's essential",
          description: p.description || "A thoughtful companion for your next project.",
          price: p.variants?.[0]?.calculated_price?.calculated_amount ?? p.variants?.[0]?.prices?.[0]?.amount ?? 0,
          tag: "Made for makers",
          kind: "bag",
        }));
        setProducts(mapped);
      }
    }).catch(() => setNotice("Showing the sample collection. Check your Medusa URL, region and publishable key to load live products."));
  }, []);

  function add(id: string) {
    setCart((old) => ({ ...old, [id]: (old[id] || 0) + 1 }));
    setNotice("Added to your bag.");
    window.setTimeout(() => setNotice(""), 2200);
  }
  function change(id: string, delta: number) {
    setCart((old) => { const next = { ...old, [id]: Math.max(0, (old[id] || 0) + delta) }; if (!next[id]) delete next[id]; return next; });
  }

  return <main>
    <div className="announcement">Free shipping on orders over €60 · Made for slow moments</div>
    <header className="nav"><a className="brand" href="#home">thread<span>kind</span></a><nav><a href="#shop">Shop kits</a><a href="#story">Our philosophy</a><a href="#journal">Maker's note</a></nav><button className="cartbtn" onClick={() => setCartOpen(true)}>Bag ({count}) ↗</button></header>
    <section className="hero" id="home"><div className="hero-copy"><div className="eyebrow">For the joy of making</div><h1>Less untangling.<br/>More <em>unwinding.</em></h1><p>Thoughtful little tools for your next big idea. Keep your yarn calm, your notions close, and your favourite project ready to go wherever life takes you.</p><div className="actions"><a className="btn" href="#shop">SHOP THE PROJECT KIT ↗</a><a className="btn secondary" href="#story">Our story</a></div><small>Designed for makers · Packed with care · Ready for your next row</small></div><div className="hero-art"><div className="stamp">MADE FOR<br/>YOUR NEXT<br/>CAST ON ✳</div><div className="yarnball"/><div className="skein"/><div className="tag"><strong>The Sunday Kit</strong><span>Your project, in its happy place</span></div></div></section>
    <div className="benefits"><span>Yarn stays tangle-free</span><span>Everything has a place</span><span>Made to move with you</span><span>Small-batch mindset</span></div>
    <section className="section" id="shop"><div className="section-head"><div><div className="eyebrow">The maker's essentials</div><h2>Make room for making.</h2></div><p>Simple, useful companions for the projects you can't put down.</p></div><div className="products">{products.map((p, i) => <article className="product" key={p.id}><div className={`product-art art-${i % 3}`}><span className="pill">{p.tag}</span><div className={p.kind === "bag" ? "bag" : p.kind === "skein" ? "skein-small" : "mini-yarn"}/></div><div className="product-info"><h3>{p.title}</h3><p>{p.description}</p><div className="buyline"><strong>{euro(p.price)}</strong><button className="add" onClick={() => add(p.id)}>ADD TO BAG +</button></div></div></article>)}</div></section>
    <section className="story" id="story"><div className="story-art"><div className="yarnball"/><div className="skein"/></div><div><div className="eyebrow">A softer kind of productivity</div><h2>Your hands are busy.<br/>Your mind can rest.</h2><p>We believe making things should feel like a pause, not another thing to organise. Threadkind starts with the small frustrations — tangled yarn, missing stitch markers, a project left at home — and makes room for the good part: making.</p><a href="#shop" className="btn">FIND YOUR KIT ↗</a></div></section>
    <section className="newsletter" id="journal"><div className="eyebrow">Notes from the making table</div><h2>A little more making. A little less scrolling.</h2><p>New tools, thoughtful tips, and occasional yarn talk. No noise.</p><form onSubmit={e => { e.preventDefault(); setNotice("Thanks for your interest! Newsletter signup will be connected before launch."); }}><input type="email" placeholder="Your email address" required aria-label="Email address"/><button className="btn">COUNT ME IN ↗</button></form></section>
    <footer className="footer"><span className="brand">thread<span>kind</span></span><span>Made for slow moments. © 2026 Threadkind</span><span>Shipping · Returns · Contact</span></footer>
    {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><h2>Your bag</h2><button className="close" onClick={() => setCartOpen(false)}>×</button></div><div className="cartitems">{products.filter(p => cart[p.id]).map(p => <div className="cartrow" key={p.id}><div><strong>{p.title}</strong><small>{euro(p.price)} each</small></div><div className="qty"><button onClick={() => change(p.id, -1)}>−</button>{cart[p.id]}<button onClick={() => change(p.id, 1)}>+</button></div></div>)}{count === 0 && <p>Your bag is waiting for a project. Add something lovely to get started.</p>}</div><div className="subtotal"><span>Subtotal</span><span>{euro(subtotal)}</span></div><button className="btn checkout" disabled={count === 0} onClick={() => setNotice("Demo cart only: configure Medusa cart and a payment provider to enable checkout.")}>CONTINUE TO CHECKOUT ↗</button><p className="notice">Cart UI is a starter. Real order creation and payments need Medusa checkout integration.</p></aside></div>}
    {notice && <div className="toast" role="status">{notice}</div>}
  </main>;
}