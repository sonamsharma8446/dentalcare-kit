import { categories } from '../data/products';
import { safetyPrinciples, redFlags, sources } from '../data/guide';

export default function Safety() {
  return (
    <section id="safety" className="section" aria-labelledby="safety-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Safety first</p>
          <h2 id="safety-title">Safety information</h2>
          <p>
            Dental emergency products are for short-term comfort. They are not treatment, and
            nothing on this page is medical advice.
          </p>
        </div>

        <div className="safety-grid">
          <div>
            <ul className="principles">
              {safetyPrinciples.map((item) => (
                <li className="principle" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>

            <h3 className="subheading">Safety notes by product type</h3>
            <div className="safety-details">
              {categories.map((category) => (
                <details key={category.id}>
                  <summary>{category.name}</summary>
                  <div className="details-body">
                    <ul>
                      {category.cautions.map((caution) => (
                        <li key={caution}>{caution}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <aside className="redflag" aria-labelledby="redflag-title">
            <h3 id="redflag-title">Get urgent dental or medical help if you have</h3>
            <ul>
              {redFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
            <p>If in doubt, contact a dentist or your local emergency services.</p>
          </aside>
        </div>

        <div className="sources">
          <h3 className="subheading">Where this information comes from</h3>
          <p>
            The notes above were summarised in our own words from these pages. Some are consumer
            health articles or a single manufacturer&rsquo;s instructions, so treat them as general
            guidance only.
          </p>
          <ul>
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
