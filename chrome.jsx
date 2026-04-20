// Top nav + sidebar + breadcrumb

const NavItem = ({ children, hasChevron, onClick, hasIcon }) => (
  <div onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 6, height: 24,
    fontFamily: "Circular, sans-serif", fontSize: 16, color: SP_NAV_TEXT, cursor: "pointer",
  }}>
    {hasIcon && <Icons.Search size={16} stroke={SP_NAV_TEXT} />}
    <span>{children}</span>
    {hasChevron && <Icons.ChevronDown size={16} stroke={SP_NAV_TEXT} />}
  </div>
);

function TopNav() {
  return (
    <div style={{
      height: 64, background: "white", borderBottom: `1px solid ${SP_BORDER}`,
      display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <NewselaLogo />
        <NavItem hasIcon>Search</NavItem>
        <NavItem hasChevron>Browse</NavItem>
        <NavItem hasChevron>Your Content</NavItem>
        <NavItem>Assignments</NavItem>
        <NavItem hasChevron>Reports</NavItem>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_NAV_TEXT }}>Educator Center</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: SP_BORDER,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 11, color: SP_NAV_TEXT, letterSpacing: 0.5,
          }}>DG</div>
          <Icons.ChevronDown size={16} stroke={SP_NAV_TEXT} />
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ label, active, indent, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: "relative",
      display: "flex", alignItems: "center", height: 32,
      paddingLeft: indent ? 28 : 0, cursor: "pointer",
      borderRadius: "2px 8px 8px 2px",
      background: active ? "white" : "transparent",
      marginRight: -8, paddingRight: 12,
    }}>
      {active && <div style={{
        position: "absolute", left: -16, top: 4, bottom: 4, width: 4, borderRadius: 2, background: "rgb(4,51,122)",
      }} />}
      <span style={{
        fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_TEXT2,
        fontWeight: active ? 700 : 400,
      }}>{label}</span>
    </div>
  );
}

function Sidebar() {
  return (
    <aside style={{
      width: 231, background: SP_BG, padding: "32px 24px", flexShrink: 0,
      borderRight: `1px solid ${SP_BORDER_LT}`, alignSelf: "stretch",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 12,
          letterSpacing: 1, color: SP_GREY, textTransform: "uppercase", marginBottom: 4,
        }}>Reports</div>
        <SidebarLink label="Usage report" />
        <SidebarLink label="Standards performance" active />
        <SidebarLink label="Power words" />
      </div>
    </aside>
  );
}

function Breadcrumb() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <span style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_GREY, textDecoration: "underline", cursor: "pointer" }}>Reports</span>
      <Icons.Slash size={12} stroke={SP_GREY} />
      <span style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_TEXT }}>Standards performance</span>
    </div>
  );
}

Object.assign(window, { TopNav, Sidebar, Breadcrumb });
