import { concerns } from '../data/guide';
import { getCategory } from '../data/products';
import { Illustration } from './Illustrations';

export default function ConcernGuide({ onSelect }) {
  return (
    <section id="guide" className="section" aria-labelledby="guide-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Visual guide</p>
          <h2 id="guide-title">What is the problem?</h2>
          <p>
            Five common dental concerns, what can help for a short time, and when it is time to
            see a dentist. This is general information, not a diagnosis.
          </p>
        </div>

        <ul className="concern-grid">
          {concerns.map((concern) => {
            const category = getCategory(concern.category);
            return (
              <li key={concern.id}>
                <article className="concern-card">
                  <div className="concern-head">
                    <div className="concern-art">
                      <Illustration type={concern.category} />
                    </div>
                    <h3>{concern.title}</h3>
                  </div>

                  <div className="concern-row">
                    <h4>You might notice</h4>
                    <p>{concern.notice}</p>
                  </div>
                  <div className="concern-row">
                    <h4>Short-term help</h4>
                    <p>{concern.help}</p>
                  </div>
                  <div className="concern-row alert">
                    <h4>See a dentist</h4>
                    <p>{concern.seeDentist}</p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => onSelect(concern.category)}
                  >
                    See {category.shortName.toLowerCase()} products
                  </button>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
