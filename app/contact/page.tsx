
import Link from "next/link";
import ContactForm from "../components/contact-form";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact Ranjeet Labs | Start Your Project",
  description:
    "Contact Ranjeet Labs to discuss websites, custom software, AI solutions, automation, web applications, and technology projects.",
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>

          <Link href="/" className={styles.backLink}>
            ← Back to Ranjeet Labs
          </Link>

          <div style={{ marginTop: 40 }}>
            <span className={styles.eyebrow}>LET US WORK TOGETHER</span>

            <h1 className={styles.title}>
              Have an idea?
              <br />
              <span className={styles.titleAccent}>Build your idea.</span>
            </h1>

            <p className={styles.intro}>
              Whether you need a website, custom software, an AI solution, or
              automation for your business, tell us what you have in mind.
              We can turn your idea into something real.
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.info}>
              <h2>Tell us about your project</h2>

              <p>
                Fill out the form and we will connect with you directly on
                WhatsApp to discuss your project.
              </p>

              <div className={styles.direct}>
                <span className={styles.directLabel}>Prefer WhatsApp?</span>

                <a
                  href="https://wa.me/917678691841"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat with us directly
                </a>
              </div>
            </div>

            <div className={styles.formCard}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
