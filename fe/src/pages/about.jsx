

const About = () => {
  return (
    <div>
      <div className="container">
        <h3>Encuentranos en:</h3>
        {/* Paste the Google Maps embed code here */}
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3699.2391866725648!2d-99.0143871236523!3d22.002144453634426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d612a7e1466d59%3A0x4bd984913f9abd02!2sQueens!5e0!3m2!1ses-419!2sus!4v1689964550522!5m2!1ses-419!2sus"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default About;
