import type { ButtonHTMLAttributes, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <section className={`card ${className}`} onClick={onClick}>
      {children}
    </section>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "success";
};

export function Button({ className = "", variant = "secondary", ...props }: ButtonProps) {
  return <button className={`button button-${variant} ${className}`} {...props} />;
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
