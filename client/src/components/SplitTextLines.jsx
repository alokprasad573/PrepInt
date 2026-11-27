/**
 * Renders multi-line headings inside overflow-hidden clip wrappers for GSAP line reveals
 * while exposing the complete semantic heading text to assistive technologies.
 */
const SplitTextLines = ({
  as: Tag = "h1",
  ariaLabel,
  lines = [],
  className = "",
  lineClassName = "hero-line-inner",
}) => {
  return (
    <Tag className={className} aria-label={ariaLabel}>
      <span aria-hidden="true" className="block">
        {lines.map((line, index) => (
          <span
            key={index}
            className="block overflow-hidden pb-1 -mb-1"
          >
            <span className={`block will-change-transform ${lineClassName}`}>
              {line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
};

export default SplitTextLines;
