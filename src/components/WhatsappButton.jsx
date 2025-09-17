export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/51971998418?text=Hola%20quiero%20saber%20más%20sobre%20un%20producto"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-50"
    >
      <img
        src="/images/whatsapp.png"
        alt="WhatsApp"
        className="w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
      />
    </a>
  );
}
