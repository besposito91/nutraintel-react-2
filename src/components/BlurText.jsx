// Divide il testo in parole per le animazioni "blur-in" stile Exo
export default function BlurText({ as: Tag = 'span', text, className = '', ...rest }) {
  return (
    <Tag className={className} aria-label={text} {...rest}>
      {text.split(' ').map((w, i) => (
        <span className="bw" aria-hidden="true" key={i}>{w}{' '}</span>
      ))}
    </Tag>
  );
}
