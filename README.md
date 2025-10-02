# API Ecommerce  🛒
Este proyecto fue creado como proyecto final del curso de Programación Backend I: Desarrollo Avanzado de Backend de Coderhouse. Este es una aplicación de Node.js con Express que utiliza MongoDB y mongoose para la persistencia de datos. Las vistas de frontend se maneja con Handlebars. Se implementa un sistema de productos con paginación, orden asc/desc de precios y filtro segun categorias o productos disponibles. A su vez cuenta con un carrito de compras con CRUD completo. Además, integra Socket.IO para actualizaciones en tiempo real de los productos el cual tambien permite mediante un formulario en el front end, agregar nuevos productos.

![Inicio](/img/home-view.jpeg) 

## Librerias 📖

- [SweetAlert2](https://sweetalert2.github.io): Librería utilizada para crear alerts de "producto añadido", mas estéticos.

## Instalación ⚙️
```bash
 git clone https://github.com/BarbaraAndro/ecommerce-andro
 cd api
 npm install
 npm node ./index.js   
```

## URL's 🌐
Ejemplos de URL's:  
-Url para paginación y limite de productos por pagina: **http://localhost:8080/api/products?page=2&limit=10**   
-Url para orden precio ascendente: **http://localhost:8080/api/products?sort=asc**   
-Url para filtrar con categoria tecnologia: **http://localhost:8080/api/products?category=tecnologia**  
-Url para filtrar por articulos disponibles: **http://localhost:8080/api/products?stock=true**

##
Proyecto creado por Barbara Andro 