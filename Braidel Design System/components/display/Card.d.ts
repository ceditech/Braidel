import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Elevation/border treatment. @default "default" */
  variant?: 'default' | 'flat' | 'raised';
  /** Apply uniform inner padding (space-6). */
  padded?: boolean;
  /** Lift + shadow on hover (use for clickable cards). */
  interactive?: boolean;
  /** Element/tag to render. Use "a" for a clickable card. @default "div" */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Surface container — the core of Braidel's card-based layouts.
 * Compose with CardMedia (top image) and CardBody (padded content).
 * @startingPoint section="Display" subtitle="Cards: media + body, interactive variants" viewport="700x360"
 */
export function Card(props: CardProps): JSX.Element;
export function CardBody(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export function CardMedia(props: { src: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>): JSX.Element;
