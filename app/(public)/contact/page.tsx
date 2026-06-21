'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setLoading(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="container container--shell py-12 md:py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto">
            Have questions, feedback, or news tips? Get in touch with our editorial and advertising teams.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card p-6 border border-border/40 bg-card/20 rounded-3xl space-y-6">
              <h3 className="text-xl font-display font-bold">Office Information</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="p-3 h-fit rounded-xl bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-foreground/70 uppercase tracking-wider mb-1">
                      Editorial & Office Address
                    </h5>
                    <p className="text-base text-foreground font-medium">ESB Media Limited</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                      House #36/1, Avenue #01, Block-A, Section-10, Mirpur, Pallabi, Dhaka-1216, Bangladesh.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 h-fit rounded-xl bg-primary/10 text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-foreground/70 uppercase tracking-wider mb-1">
                      Email Address
                    </h5>
                    <a
                      href="mailto:news@esbpowerline.com"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      news@esbpowerline.com
                    </a>
                    <a
                      href="mailto:esb.bd08@gmail.com"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      esb.bd08@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 h-fit rounded-xl bg-primary/10 text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-foreground/70 uppercase tracking-wider mb-1">
                      Advertising & Support
                    </h5>
                    <a
                      href="tel:+8801711378733"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      +8801711-378733
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="card p-6 md:p-8 border border-border/40 bg-card/25 rounded-3xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-display font-bold">Message Sent!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. A member of our editorial or support team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="btn border border-border hover:bg-muted mt-4 text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-display font-bold">Send a Message</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-muted/40 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-foreground"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Email <span className="text-primary">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-muted/40 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-foreground"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-muted/40 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-foreground"
                      placeholder="Advertising request, news tip, support..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-muted/40 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-foreground resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn btn--primary flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:opacity-95 disabled:opacity-50"
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
