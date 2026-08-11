from pathlib import Path
import re

path = Path("index.html")
html = path.read_text()

slide_pattern = re.compile(
    r'(?ms)^       <article aria-label="2 of 9".*?^       </article>(?=\n       <article aria-label="3 of 9")'
)
slide_match = slide_pattern.search(html)
assert slide_match, "Carousel slide 2 was not found"
assert "school-fundraiser-article.carousel.v1.webp" in slide_match.group(0), "Unexpected carousel slide 2 source"

new_slide = '''       <article aria-label="2 of 9" aria-roledescription="slide" class="record-carousel__slide record-carousel__slide--landscape" data-record-slide="" hidden="">
        <figure class="record-carousel__media record-carousel__media--landscape" style='
                    --media-image: url("./assets/photos/spring-shoreline-cleanup.carousel.v1.webp");
                  '>
         <img alt="Wasaga Beach spring shoreline clean-up poster beside a photo of volunteers on the beach" class="record-carousel__image record-carousel__image--landscape" decoding="async" height="675" loading="lazy" src="./assets/photos/spring-shoreline-cleanup.carousel.v1.webp" width="1200"/>
        </figure>
        <div class="record-carousel__content">
         <span class="record-carousel__number">
          02
         </span>
         <p class="record-carousel__tag">
          Community clean-up
         </p>
         <h4>
          Joining the annual spring shoreline clean-up.
         </h4>
         <p>
          On April 19, 2026, despite a freezing-cold day, many residents came out for the annual spring shoreline clean-up at Beach Area 2. Mike joined volunteers and community partners in helping keep Wasaga Beach clean and welcoming.
         </p>
        </div>
       </article>'''

html, slide_count = slide_pattern.subn(new_slide, html, count=1)
assert slide_count == 1, f"Carousel slide replacements: {slide_count}"

card_pattern = re.compile(
    r'(?ms)^      <figure class="community-card[^\n]*\n       <img [^\n]*sweet-smiles-wasaga-beach\.carousel\.v1\.webp[^\n]*\n.*?^      </figure>'
)
card_match = card_pattern.search(html)
assert card_match, "Smile Cookie community card was not found"

new_card = '''      <figure class="community-card reveal community-card--landscape community-card--span-two" data-delay="275" data-reveal="image">
       <img alt="Mike Foley supporting the Smile Cookie campaign alongside a photo of decorated smile cookies" class="community-card__image community-card__image--landscape" decoding="async" height="675" loading="lazy" src="./assets/photos/smile-cookie-campaign-community.v1.webp" width="1200"/>
       <figcaption>
        <span>
         Student nutrition
        </span>
        <strong>
         Supporting the Smile Cookie campaign for local students
        </strong>
        <p>
         Mike joined school and community partners in celebrating Wasaga Beach's Smile Cookie campaign. The effort raised $14,530.88 for Eat Well to Excel, helping support student nutrition programs at Worsley Elementary and Birchview Dunes schools.
        </p>
       </figcaption>
      </figure>'''

html, card_count = card_pattern.subn(new_card, html, count=1)
assert card_count == 1, f"Smile Cookie card replacements: {card_count}"

assert "school-fundraiser-article.carousel.v1.webp" not in html
assert "sweet-smiles-wasaga-beach.carousel.v1.webp" not in html
assert "spring-shoreline-cleanup.carousel.v1.webp" in html
assert "smile-cookie-campaign-community.v1.webp" in html

path.write_text(html)
