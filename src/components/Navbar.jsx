const links = [
  { href: '/', label: 'Inicio' },
  { href: '/politica-de-privacidad.html', label: 'Privacidad' }
];

export function Navbar() {
  return (
    <header>
      <nav className="container nav">
        <a href="/" className="logo">Boutique</a>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
