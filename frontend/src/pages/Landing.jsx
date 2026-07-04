import { Link } from 'react-router-dom';

export default function Landing() {
  const features = [
    {
      icon: '👾',
      title: 'PIXEL PERFECT',
      desc: 'Görevlerinizi saniyeler içinde oluşturun, atayın ve retro şıklığıyla takip edin.'
    },
    {
      icon: '🏆',
      title: 'GOAL DRIVEN',
      desc: 'Projelerinizin ne kadarının tamamlandığını retro ilerleme çubukları ile anlık olarak görün.'
    },
    {
      icon: '👑',
      title: 'TEAM POWER',
      desc: 'Rol tabanlı erişim kontrolü ile ekibinizi yönetin. Kimin ne yaptığını görün.'
    },
    {
      icon: '💬',
      title: 'CHATROOM',
      desc: 'Her görev üzerinde ekibinizle tartışın, geri bildirim verin ve süreci hızlandırın.'
    },
    {
      icon: '🕹️',
      title: 'COZY DESIGN',
      desc: 'Masaüstü veya mobil fark etmez; cozy pixel art UI her ekrana uyum sağlar.'
    },
    {
      icon: '✨',
      title: 'NO PLACEHOLDERS',
      desc: 'Gerçek zamanlı retro atmosfer, cozy renk tonları ve kusursuz detaylar.'
    }
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="sidebar-brand" style={{ padding: 0 }}>
          <div className="brand-icon">👾</div>
          <h1>TASKFLOW</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn btn-ghost">Giriş Yap</Link>
          <Link to="/register" className="btn btn-primary">Kaydol</Link>
        </div>
      </nav>

      <section className="hero">
        <h1>PROJELERİNİZİ VE GÖREVLERİNİZİ <br /> <span style={{ color: 'var(--accent)' }}>RETRO TARZDA YÖNETİN</span></h1>
        <p>
          TaskFlow ile işlerinizi düzene koyun, ekibinizle cozy bir atmosferde 
          işbirliği yapın ve hedeflerinize piksel piksel ulaşın!
        </p>
        <div className="hero-btns" style={{ gap: '1rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
            HEMEN BAŞLAYIN
          </Link>
          <Link to="/register" className="btn btn-ghost" style={{ padding: '0.8rem 1.6rem' }}>
            ÜCRETSİZ KAYDOL
          </Link>
        </div>
      </section>

      <section id="features" className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="card feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3 className="pixel-title" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>{f.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '1rem', borderTop: '2px solid var(--pixel-border)', background: 'var(--bg-dark)' }}>
        <p>&copy; 2026 TASKFLOW. HER HAKKI SAKLIDIR. <br /> COZY PIXEL ART UI EDITION.</p>
      </footer>
    </div>
  );
}
