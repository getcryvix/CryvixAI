export const hotelTemplate = `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{{hotelName}}</title>

<link rel="preconnect" href="https://fonts.googleapis.com">

<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

html{
scroll-behavior:smooth;
}

body{

font-family:'Poppins',sans-serif;

background:#0f172a;

color:white;

overflow-x:hidden;

}

:root{

--gold:#d4af37;

--dark:#08111f;

--card:#162033;

--text:#f5f5f5;

--gray:#9ca3af;

}

a{
text-decoration:none;
color:white;
}

section{

padding:90px 8%;

}

.container{

max-width:1300px;

margin:auto;

}

.navbar{

position:fixed;

top:0;

left:0;

width:100%;

padding:20px 8%;

display:flex;

justify-content:space-between;

align-items:center;

backdrop-filter:blur(18px);

background:rgba(8,17,31,.65);

border-bottom:1px solid rgba(255,255,255,.08);

z-index:999;

}

.logo{

font-size:28px;

font-weight:800;

color:var(--gold);

letter-spacing:1px;

}

.menu{

display:flex;

gap:35px;

}

.menu a{

font-weight:500;

transition:.3s;

}

.menu a:hover{

color:var(--gold);

}

.hero{

min-height:100vh;

background:
linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.6)),
url("{{heroImage}}") center/cover no-repeat;

display:flex;

align-items:center;

justify-content:center;

text-align:center;

}

.hero-content{

max-width:850px;

}

.hero h1{

font-size:70px;

line-height:1.1;

margin-bottom:25px;

}

.hero p{

font-size:20px;

color:#ececec;

line-height:1.8;

margin-bottom:40px;

}

.btn{

display:inline-block;

padding:18px 42px;

background:var(--gold);

color:black;

font-weight:700;

border-radius:60px;

transition:.35s;

}

.btn:hover{

transform:translateY(-6px);

}

</style>

</head>

<body>

<nav class="navbar">

<div class="logo">

{{hotelName}}

</div>

<div class="menu">

<a href="#home">Home</a>

<a href="#about">About</a>

<a href="#rooms">Rooms</a>

<a href="#gallery">Gallery</a>

<a href="#contact">Contact</a>

</div>

</nav>

<section class="hero" id="home">

<div class="hero-content">

<h1>

{{hotelName}}

</h1>

<p>

{{hotelDescription}}

</p>

<a class="btn" href="#rooms">

Book Your Stay

</a>

</div>

</section>
<section id="about">

<div class="container">

<h2 style="text-align:center;font-size:42px;margin-bottom:20px;">
Welcome to {{hotelName}}
</h2>

<p style="text-align:center;color:var(--gray);max-width:900px;margin:auto;line-height:1.9;font-size:18px;">
{{hotelDescription}}
</p>

</div>

</section>

<section id="rooms">

<div class="container">

<h2 style="text-align:center;font-size:42px;margin-bottom:50px;">
Luxury Rooms
</h2>

<p style="text-align:center;color:var(--gray);margin-bottom:40px;">
{{roomsDescription}}
</p>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:30px;">

<div style="background:var(--card);border-radius:20px;overflow:hidden;">
<img src="{{heroImage}}" style="width:100%;height:220px;object-fit:cover;">
<div style="padding:25px;">
<h3>Deluxe Room</h3>
<p style="color:var(--gray);margin-top:12px;">
Elegant room with king-size bed, free Wi-Fi and city view.
</p>
</div>
</div>

<div style="background:var(--card);border-radius:20px;overflow:hidden;">
<img src="{{heroImage}}" style="width:100%;height:220px;object-fit:cover;">
<div style="padding:25px;">
<h3>Executive Suite</h3>
<p style="color:var(--gray);margin-top:12px;">
Luxury suite with premium interiors and private lounge.
</p>
</div>
</div>

<div style="background:var(--card);border-radius:20px;overflow:hidden;">
<img src="{{heroImage}}" style="width:100%;height:220px;object-fit:cover;">
<div style="padding:25px;">
<h3>Presidential Suite</h3>
<p style="color:var(--gray);margin-top:12px;">
Our finest suite offering world-class comfort and service.
</p>
</div>
</div>

</div>
</div>

</section>
<section id="amenities">

<div class="container">

<h2 style="text-align:center;font-size:42px;margin-bottom:50px;">
Premium Amenities
</h2>

<div style="
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:25px;
">

<div style="background:var(--card);padding:35px;border-radius:20px;text-align:center;">
<h3>🏊 Infinity Pool</h3>
<p style="margin-top:12px;color:var(--gray);">
Relax in our luxury swimming pool.
</p>
</div>

<div style="background:var(--card);padding:35px;border-radius:20px;text-align:center;">
<h3>🍽 Fine Dining</h3>
<p style="margin-top:12px;color:var(--gray);">
International cuisine prepared by top chefs.
</p>
</div>

<div style="background:var(--card);padding:35px;border-radius:20px;text-align:center;">
<h3>💆 Spa & Wellness</h3>
<p style="margin-top:12px;color:var(--gray);">
Refresh your body and mind.
</p>
</div>

<div style="background:var(--card);padding:35px;border-radius:20px;text-align:center;">
<h3>🏋 Fitness Center</h3>
<p style="margin-top:12px;color:var(--gray);">
Modern gym with premium equipment.
</p>
</div>

</div>

</div>

</section>
</body>
</html>
`;