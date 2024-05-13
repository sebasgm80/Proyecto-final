import { useInView } from 'react-intersection-observer';

const LazyImage = ({ src, alt }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5  // Ajusta este valor según necesites que la imagen aparezca más temprano o más tarde
  });

  return (
    <div ref={ref} className={`fade-in-section ${inView ? 'is-visible' : ''}`}>
      <img src={inView ? src : ''} alt={alt} />
    </div>
  );
};

export default LazyImage;
