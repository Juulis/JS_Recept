$(applyLayout);


function applyLayout() {

    let baseHtml = `
<div class="wrapper">

<header class="header">
    <img src="/src/logo.jpg">
</header>

    <nav class="navbar navbar-expand-lg navbar-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="/index.html">Home <span class="sr-only">(current)</span></a>
            </li>
        
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Alternativ kost
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Standard</a>
                <a class="dropdown-item" href="#">Mjölkfritt</a>
                <a class="dropdown-item" href="#">Glutenfritt</a>
                <a class="dropdown-item" href="#">Vegetariskt</a>
              </div>
            </li>
            <li class="nav-item">
                    <a class="nav-link" href="/about_us.html">Om oss</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input id="searchfield" class="form-control mr-sm-2" type="search" placeholder="Sök recept" aria-label="Sök">
          </form>
          <button id="searchBtn" class="btn btn-outline-success my-2 my-sm-0">Sök</button>
          </div>
      </nav>

<div class="middle">
    <div class="container">
        <main class="content">
           </main>
    </div>

    <aside class="left-sidebar">
    <h3>Recept:</h3>
        </aside>
</div>

<footer class="footer">
        <p>&copy;Juulis</p>
    <img src="/src/facebook.png">
    <img src="/src/instagram.png">
    <img src="/src/twitter.png">
</footer>

</div>
`;

    $('body').append(baseHtml);
}