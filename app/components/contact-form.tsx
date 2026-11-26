
"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "Website / Web Application",
  "AI Chatbot / AI Assistant",
  "AI Automation",
  "Custom Software",
  "Video Editing Application / Tool",
  "Business Automation",
  "Mobile Application",
  "E-commerce Website",
  "Other / I Have an Idea",
];

const BUDGETS = [
  "Not decided yet",
  "Under ₹5,000",
  "₹5,000 – ₹15,000",
  "₹15,000 – ₹30,000",
  "₹30,000 – ₹50,000",
  "₹50,000+",
  "Let's discuss",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = `Hello Ranjeet Labs!

Name: ${name}
WhatsApp Number: ${phone}
Project Type: ${projectType}
Budget: ${budget || "Not specified"}

Project Details:
${description}`;

    const whatsappURL = `https://wa.me/917678691841?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="contact-form-grid">
        <div className="contact-field">
          <label htmlFor="contact-name">Your name *</label>
          <input
            id="contact-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-phone">WhatsApp number *</label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-project">Project type *</label>
          <select
            id="contact-project"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            required
          >
            <option value="">Select a project type</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="contact-field">
          <label htmlFor="contact-budget">Estimated budget</label>
          <select
            id="contact-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Select your budget</option>
            {BUDGETS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="contact-description">Tell us about your project *</label>
        <textarea
          id="contact-description"
          placeholder="Describe your idea, what you need, and any features you have in mind..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          required
        />
      </div>

      <button type="submit" className="contact-submit">
        Send Project Inquiry
        <span aria-hidden="true"> ↗</span>
      </button>

      <p className="contact-form-note">
        Your inquiry will open in WhatsApp. You can review the message before
        sending it.
      </p>
    </form>
  );
}
