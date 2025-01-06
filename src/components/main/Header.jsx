export default function Header() {
    return (
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center justify-center gap-4">
          <img 
            src="https://portal.pi.gov.br/jucepi/wp-content/uploads/sites/47/2023/03/jucepi_logo-768x177.jpg" 
            alt="JUCEPI Logo" 
            className="h-16 object-contain"
          />
          <h1 className="text-[#034ea2] text-2xl font-semibold">
            Dados Empresariais
          </h1>
        </div>
      </header>
    );
  };
  