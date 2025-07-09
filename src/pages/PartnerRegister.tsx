import { useTranslation } from "@/contexts/TranslationContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";

const PartnerRegister = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    contactEmail: "",
    businessAddress: "",
    postalCode: "",
    businessDescription: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded shadow p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">{t('partner.register.title')}</h1>
          <p className="mb-6 text-center text-gray-600">{t('partner.register.subtitle')}</p>
          {success ? (
            <div className="text-green-600 text-center font-semibold mb-4">{t('success.saved')}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">{t('partner.register.businessName')}</label>
                <input
                  className="w-full p-2 border rounded"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder={t('partner.register.businessNamePlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">{t('partner.register.businessType')}</label>
                <input
                  className="w-full p-2 border rounded"
                  name="businessType"
                  value={form.businessType}
                  onChange={handleChange}
                  placeholder={t('partner.register.businessType')}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">{t('partner.register.contactEmail')}</label>
                <input
                  className="w-full p-2 border rounded"
                  name="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder={t('partner.register.contactEmailPlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">{t('partner.register.businessAddress')}</label>
                <input
                  className="w-full p-2 border rounded"
                  name="businessAddress"
                  value={form.businessAddress}
                  onChange={handleChange}
                  placeholder={t('partner.register.businessAddressPlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">{t('partner.register.postalCodePlaceholder')}</label>
                <input
                  className="w-full p-2 border rounded"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder={t('partner.register.postalCodePlaceholder')}
                />
              </div>
              <div>
                <label className="block mb-1">{t('partner.register.businessDescription')}</label>
                <textarea
                  className="w-full p-2 border rounded"
                  name="businessDescription"
                  value={form.businessDescription}
                  onChange={handleChange}
                  placeholder={t('partner.register.businessDescriptionPlaceholder')}
                  rows={3}
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded font-semibold"
                type="submit"
                disabled={submitting}
              >
                {submitting ? t('partner.register.submitting') : t('partner.register.submit')}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartnerRegister;
