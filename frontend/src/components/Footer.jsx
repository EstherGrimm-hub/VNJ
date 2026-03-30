import React from "react";
import { siteContent } from "../data/siteContent";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-features">
        <div className="container">
          {siteContent.footerFeatures.map((item, index) => (
            <div className="feature-item" key={index}>
              <i className={item.icon}></i>
              <div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="footer-main">
          <div className="footer-contact">
            <h3>{siteContent.footer.contact.logo}</h3>
            <p>{siteContent.footer.contact.phone}</p>

            <div className="social-links">
              {siteContent.footer.contact.socials.map((icon, index) => (
                <a href="#" key={index}>
                  <i className={icon}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-newsletter">
            <div className="newsletter-box">
              <div>
                <h3>{siteContent.footer.newsletter.title}</h3>
                <p>{siteContent.footer.newsletter.text}</p>
              </div>

              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder={siteContent.footer.newsletter.placeholder}
                />
                <button type="submit">
                  {siteContent.footer.newsletter.buttonText}
                </button>
              </form>
            </div>
          </div>

          <div className="footer-links">
            {siteContent.footer.links.map((group, index) => (
              <div className="footer-column" key={index}>
                <h4>{group.title}</h4>
                {group.items.map((item, i) => (
                  <a href="#" key={i}>
                    {item}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <p>{siteContent.footer.bottom.copyright}</p>

            <div className="payment-methods">
              {siteContent.footer.bottom.payments.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}