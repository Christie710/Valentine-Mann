import { motion } from "framer-motion";
// Local bundled images for moments cards.
import imgMoment1 from "./images/Screenshot_20241104_222828_Instagram.jpg";
import imgMoment2 from "./images/Screenshot_20241104_222820_Instagram.jpg";

const moments = [
  {
    title: "Best Thing That Ever Happened To Me",
    note: "Soft light, loud heart.",
    image: imgMoment1
  },
  {
    title: "The day you stole my heart",
    note: "Still my favorite memory.",
    image: imgMoment2
  },

];

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.55, ease: "easeOut" }
  })
};

const MomentsCards = () => (
  <div className="moments-grid">
    {moments.map((moment, index) => (
      <motion.article
        key={moment.title}
        className="moment-card"
        custom={index}
        initial="hidden"
        whileInView="visible"
        whileHover={{ y: -2, scale: 1.004 }}
        viewport={{ once: true, amount: 0.25 }}
        variants={cardVariants}
      >
        <img src={moment.image} alt={moment.title} loading="lazy" />
        <h3>{moment.title}</h3>
        <p className="moment-note">{moment.note}</p>
      </motion.article>
    ))}
  </div>
);

export default MomentsCards;
