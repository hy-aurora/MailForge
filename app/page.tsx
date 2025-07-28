import QuotationForm from "@/components/QuotationForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MailForge</h1>
          <p className="text-xl text-gray-600">
            Professional Email Service with PDF Attachment Support
          </p>
        </div>
        <QuotationForm />
      </div>
    </main>
  );
}
