// import { useEffect, useState } from "react";
// import { ArrowUp } from "lucide-react"; // Tailwind + Lucide combo

// const ScrollToTopButton = () => {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const toggleVisibility = () => {
//       setVisible(window.scrollY > 300);
//     };
//     window.addEventListener("scroll", toggleVisibility);
//     return () => window.removeEventListener("scroll", toggleVisibility);
//   }, []);

//   return (
//     visible && (
//       <button
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         className="fixed bottom-4 right-4 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50 transition"
//       >
//         <ArrowUp size={20} />
//       </button>
//     )
//   );
// };

// export default ScrollToTopButton;
