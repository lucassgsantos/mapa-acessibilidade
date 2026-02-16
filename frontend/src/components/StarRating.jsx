import { FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

export default function StarRating({ nota, onChange, tamanho = 'text-xl', somenteLeitura = false }) {
  return (
    <div className="star-rating flex items-center gap-1" role="group" aria-label={`Avaliação: ${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((estrela) => (
        somenteLeitura ? (
          <span key={estrela} className={`${tamanho} ${estrela <= nota ? 'text-yellow-500' : 'text-gray-300'}`} aria-hidden="true">
            {estrela <= nota ? <FaStar /> : <FiStar />}
          </span>
        ) : (
          <button
            key={estrela}
            type="button"
            onClick={() => onChange(estrela)}
            className={`${tamanho} ${estrela <= nota ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors bg-transparent border-none cursor-pointer`}
            aria-label={`${estrela} estrela${estrela > 1 ? 's' : ''}`}
          >
            {estrela <= nota ? <FaStar /> : <FiStar />}
          </button>
        )
      ))}
    </div>
  );
}
