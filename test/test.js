var val = require('../libs/unalib');
var assert = require('assert');


describe('unalib', function(){


  describe('funcion is_valid_phone', function(){

    it('deberia devolver true para 8297-8547', function(){
      assert.equal(val.is_valid_phone('8297-8547'), true);
    });

    it('deberia devolver false para 8297p-8547', function(){
      assert.equal(val.is_valid_phone('8297p-8547'), false);
    });

  });


  describe('funcion is_valid_url_image', function(){

    it('deberia devolver true para http://image.com/image.jpg', function(){
      assert.equal(val.is_valid_url_image('http://image.com/image.jpg'), true);
    });

    it('deberia devolver true para http://image.com/image.gif', function(){
      assert.equal(val.is_valid_url_image('http://image.com/image.gif'), true);
    });

    it('deberia devolver true para https://example.com/photo.png', function(){
      assert.equal(val.is_valid_url_image('https://example.com/photo.png'), true);
    });

    it('deberia devolver false para URLs con scripts', function(){
      assert.equal(val.is_valid_url_image('http://image.com/image.jpg<script>alert("hack")</script>'), false);
    });
    
  });

  describe('funcion is_valid_yt_video', function(){

    it('deberia devolver true para URL válida de YouTube', function(){
      assert.equal(val.is_valid_yt_video('https://www.youtube.com/watch?v=qYwlqx-JLok'), true);
    });

    it('deberia devolver true para youtu.be URL', function(){
      assert.equal(val.is_valid_yt_video('https://youtu.be/qYwlqx-JLok'), true);
    });

    it('deberia devolver false para URLs con scripts', function(){
      assert.equal(val.is_valid_yt_video('https://www.youtube.com/watch?v=qYwlqx-JLok<script>alert("hack")</script>'), false);
    });

  });

  describe('funcion is_valid_vimeo_video', function(){

    it('deberia devolver true para URL válida de Vimeo', function(){
      assert.equal(val.is_valid_vimeo_video('https://vimeo.com/123456789'), true);
    });

    it('deberia devolver false para URLs con scripts', function(){
      assert.equal(val.is_valid_vimeo_video('https://vimeo.com/123456789<script>alert("hack")</script>'), false);
    });

  });

  describe('funcion is_valid_direct_video', function(){

    it('deberia devolver true para archivo MP4', function(){
      assert.equal(val.is_valid_direct_video('https://example.com/video.mp4'), true);
    });

    it('deberia devolver true para archivo WEBM', function(){
      assert.equal(val.is_valid_direct_video('https://example.com/video.webm'), true);
    });

    it('deberia devolver false para URLs con scripts', function(){
      assert.equal(val.is_valid_direct_video('https://example.com/video.mp4<script>alert("hack")</script>'), false);
    });

  });

  describe('funcion containsScriptInjection', function(){

    it('deberia detectar tag script', function(){
      assert.equal(val.containsScriptInjection('<script>alert("hack")</script>'), true);
    });

    it('deberia detectar javascript: protocol', function(){
      assert.equal(val.containsScriptInjection('javascript:alert("hack")'), true);
    });

    it('deberia detectar event handlers', function(){
      assert.equal(val.containsScriptInjection('onclick=alert("hack")'), true);
    });

    it('deberia detectar iframe malicioso', function(){
      assert.equal(val.containsScriptInjection('<iframe src="javascript:alert()"></iframe>'), true);
    });

    it('deberia devolver false para texto normal', function(){
      assert.equal(val.containsScriptInjection('Hola mundo'), false);
    });

  });

  describe('funcion sanitizeText', function(){

    it('deberia escapar caracteres HTML', function(){
      assert.equal(val.sanitizeText('<script>alert("hack")</script>'), '&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;');
    });

    it('deberia manejar texto normal sin cambios', function(){
      assert.equal(val.sanitizeText('Hola mundo'), 'Hola mundo');
    });

    it('deberia manejar entrada vacía', function(){
      assert.equal(val.sanitizeText(''), '');
    });

  });

  describe('funcion validateMessage', function(){

    it('deberia bloquear inyección de scripts', function(){
      var maliciousMsg = JSON.stringify({nombre: 'Hacker', mensaje: '<script>alert("hack")</script>', color: '#000'});
      var result = JSON.parse(val.validateMessage(maliciousMsg));
      assert.equal(result.mensaje, '⚠️ Mensaje bloqueado: Intento de inyección de script detectado');
    });

    it('deberia procesar imagen válida', function(){
      var imageMsg = JSON.stringify({nombre: 'User', mensaje: 'https://example.com/image.jpg', color: '#000'});
      var result = JSON.parse(val.validateMessage(imageMsg));
      assert.ok(result.mensaje.includes('<img src="https://example.com/image.jpg"'));
    });

    it('deberia procesar video válido de YouTube', function(){
      var videoMsg = JSON.stringify({nombre: 'User', mensaje: 'https://www.youtube.com/watch?v=qYwlqx-JLok', color: '#000'});
      var result = JSON.parse(val.validateMessage(videoMsg));
      assert.ok(result.mensaje.includes('<iframe'));
    });

    it('deberia sanitizar texto normal', function(){
      var textMsg = JSON.stringify({nombre: 'User', mensaje: 'Hola <mundo>', color: '#000'});
      var result = JSON.parse(val.validateMessage(textMsg));
      assert.equal(result.mensaje, 'Hola &lt;mundo&gt;');
    });

  });

});







