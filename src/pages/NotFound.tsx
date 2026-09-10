import { SysLink, useTitle } from "../components/primitives";

export default function NotFound() {
  useTitle("Not found | Panashe Sanyanga");
  return (
    <section className="page-head" aria-labelledby="nf">
      <div className="wrap">
        <span className="mono accent">404</span>
        <h1 id="nf" className="display display-xl">
          No route
        </h1>
        <p className="lede">That page does not exist.</p>
        <div className="case-links">
          <SysLink to="/" idx="00" variant="primary">
            Home
          </SysLink>
          <SysLink to="/work" idx="01">
            Work
          </SysLink>
        </div>
      </div>
    </section>
  );
}
