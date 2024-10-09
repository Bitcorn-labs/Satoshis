const Header = () => {
  return (
    <>
      <header>
        <h1>DRAGGIN KARMA POINTS</h1>
        <h1>Paladin Wizard Society</h1>
        <h2>
          Use your karma points to unleash your inner Dragon Paladin Wizard
        </h2>
      </header>
      <div className="container">
        <div className="image-box">
          <img src="./assets/Paladin.jpg" alt="Paladin" />
          <p>Brave Paladin</p>
        </div>
        <div className="image-box">
          <img src="./assets/Borovan.jpg" alt="Dragon" />
          <p>Dragon king</p>
        </div>
        <div className="image-box">
          <img src="./assets/Priests.jpg" alt="Wizard" />
          <p>protect your eggs</p>
        </div>
        <div className="image-box">
          <img src="./assets/Eggs.jpg" alt="Egg" />
          <p>draggin karma eggs</p>
        </div>
      </div>
      <div className="banner">Dragon Paladin Wizards</div>
    </>
  );
};

export default Header;
