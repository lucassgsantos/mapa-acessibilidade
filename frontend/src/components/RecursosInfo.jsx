import { CATEGORIAS, RECURSOS } from '../constants';

export function RecursoBadge({ recurso, ativo = true }) {
  const info = RECURSOS[recurso];
  if (!info || !ativo) return null;
  const Icon = info.icon;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      role="img"
      aria-label={info.label}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {info.label}
    </span>
  );
}

export function CategoriaBadge({ categoria }) {
  const info = CATEGORIAS[categoria];
  if (!info) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      <span aria-hidden="true">{info.emoji}</span>
      {info.label}
    </span>
  );
}
