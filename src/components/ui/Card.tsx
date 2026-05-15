import React from 'react';

type CardProps<T extends React.ElementType = 'div'> = {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>;

export function Card<T extends React.ElementType = 'div'>({
  children,
  className = '',
  hover = false,
  as,
  ...rest
}: CardProps<T>) {
  const Cmp = (as ?? 'div') as React.ElementType;
  return (
    <Cmp
      className={`bg-white border hairline rounded-xl shadow-card ${hover ? 'hover:shadow-cardHover transition-shadow' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Cmp>
  );
}

export default Card;
