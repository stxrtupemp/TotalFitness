import { IconPin, IconClock, IconCall, IconMail, IconCar } from './Icons'
import './GymMap.css'

const GYM_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.0!2d-0.8070!3d37.8730!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd63a7a1a1a1a1a1%3A0x1a1a1a1a1a1a1a1a!2sAv.%20la%20Venta%2C%20S%2FN%2C%2003190%20Pilar%20de%20la%20Horadada%2C%20Alicante!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses'

export default function GymMap() {
  return (
    <section className="gymmap">
      <div className="container gymmap__inner">
        <div className="gymmap__head">
          <span className="gymmap__tag">Encuéntranos</span>
          <h2 className="gymmap__title">Nuestra ubicación</h2>
          <p className="gymmap__addr">
            Av. la Venta, S/N · 03190 Pilar de la Horadada, Alicante
          </p>
        </div>

        <div className="gymmap__wrap">
          <iframe
            title="TotalFitness — Ubicación"
            src={GYM_EMBED}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="gymmap__overlay-badge">
            <span className="gymmap__pin"><IconPin size={22} /></span>
            <div>
              <strong>TotalFitness</strong>
              <span>Pilar de la Horadada</span>
            </div>
          </div>
        </div>

        <div className="gymmap__details">
          <div className="gymmap__detail">
            <span className="gymmap__detail-icon"><IconClock size={22} /></span>
            <div>
              <strong>Horario</strong>
              <span>Lun–Vie: 06:00–23:00</span>
              <span>Sáb–Dom: 08:00–21:00</span>
            </div>
          </div>
          <div className="gymmap__detail">
            <span className="gymmap__detail-icon"><IconCall size={22} /></span>
            <div>
              <strong>Teléfono</strong>
              <span>+34 965 000 000</span>
            </div>
          </div>
          <div className="gymmap__detail">
            <span className="gymmap__detail-icon"><IconMail size={22} /></span>
            <div>
              <strong>Email</strong>
              <span>info@totalfitness.es</span>
            </div>
          </div>
          <div className="gymmap__detail">
            <span className="gymmap__detail-icon"><IconCar size={22} /></span>
            <div>
              <strong>Aparcamiento</strong>
              <span>Gratuito en el edificio</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
