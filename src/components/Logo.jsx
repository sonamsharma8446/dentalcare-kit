import { TOOTH_PATH } from './Illustrations';

// Brand mark: teal rounded square with a white tooth.
export default function Logo({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="#0f766e" />
      <path d={TOOTH_PATH} fill="#fff" transform="translate(-1 -2.4) scale(0.17)" />
    </svg>
  );
}
