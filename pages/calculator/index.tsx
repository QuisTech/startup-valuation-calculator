import ValuationForm from '../../components/ValuationForm';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <ValuationForm />
      </main>
      <Footer />
    </div>
  );
}