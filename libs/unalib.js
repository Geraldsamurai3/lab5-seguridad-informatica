// modulo de ejemplo.

module.exports = {

  // logica que valida si un telefono esta correcto...
  is_valid_phone: function (phone) {
    // inicializacion lazy
    var isValid = false;
    // expresion regular copiada de StackOverflow
    var re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/i;

    // validacion Regex
    try {
      isValid = re.test(phone);
    } catch (e) {
      console.log(e);
    }

    return isValid;
    // fin del try-catch block
  },

  is_valid_url_image: function (url) {

    // inicializacion lazy
    var isValid = false;
    // expresion regular mejorada para URLs de imágenes más segura
    var re = /^https?:\/\/[^\s<>"{}|\\^`[\]]+\.(?:jpg|jpeg|gif|png|bmp|webp)(?:\?[^\s<>"{}|\\^`[\]]*)?$/i;

    // validacion Regex
    try {
      // Verificar que no contenga scripts maliciosos
      if (this.containsScriptInjection(url)) {
        return false;
      }
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    }

    return isValid;
    // fin del try-catch block
  },

  is_valid_yt_video: function (url) {

    // inicializacion lazy
    var isValid = false;
    // expresion regular mejorada para YouTube más segura
    var re = /^https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\S+)?$/i;

    // validacion Regex
    try {
      // Verificar que no contenga scripts maliciosos
      if (this.containsScriptInjection(url)) {
        return false;
      }
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    }

    return isValid;
    // fin del try-catch block
  },

  // Nueva función para validar videos de múltiples plataformas
  is_valid_video_url: function (url) {
    return this.is_valid_yt_video(url) || this.is_valid_vimeo_video(url) || this.is_valid_direct_video(url);
  },

  is_valid_vimeo_video: function (url) {
    var isValid = false;
    var re = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:\S+)?$/i;

    try {
      if (this.containsScriptInjection(url)) {
        return false;
      }
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    }

    return isValid;
  },

  is_valid_direct_video: function (url) {
    var isValid = false;
    var re = /^https?:\/\/[^\s<>"{}|\\^`[\]]+\.(?:mp4|webm|ogg|avi|mov)(?:\?[^\s<>"{}|\\^`[\]]*)?$/i;

    try {
      if (this.containsScriptInjection(url)) {
        return false;
      }
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    }

    return isValid;
  },

  getYTVideoId: function (url) {
    var match = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    return match ? match[1] : null;
  },

  getEmbeddedCode: function (url) {
    if (this.is_valid_yt_video(url)) {
      var ytId = this.getYTVideoId(url);
      if (!ytId) return url;
      var ytCode = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + ytId + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      return ytCode;
    } else if (this.is_valid_vimeo_video(url)) {
      var vimeoId = this.getVimeoVideoId(url);
      if (!vimeoId) return url;
      var vimeoCode = '<iframe src="https://player.vimeo.com/video/' + vimeoId + '" width="560" height="315" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>';
      return vimeoCode;
    } else if (this.is_valid_direct_video(url)) {
      var videoCode = '<video width="560" height="315" controls><source src="' + url + '" type="video/mp4">Tu navegador no soporta el elemento de video.</video>';
      return videoCode;
    }
    return url; // Fallback
  },

  getVimeoVideoId: function (url) {
    var match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  },

  getImageTag: function (url) {
    var tag = '<img src="' + url + '" style="max-height: 400px;max-width: 400px;">';
    return tag;
  },

  // Función para sanitizar texto y prevenir XSS
  sanitizeText: function (text) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Función para detectar intentos de inyección de scripts
  containsScriptInjection: function (text) {
    if (!text || typeof text !== 'string') {
      return false;
    }

    var scriptPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<embed[^>]*>/gi,
      /<object[^>]*>/gi,
      /eval\s*\(/gi,
      /alert\s*\(/gi,
      /document\./gi,
      /window\./gi
    ];

    for (var i = 0; i < scriptPatterns.length; i++) {
      if (scriptPatterns[i].test(text)) {
        return true;
      }
    }

    return false;
  },

  validateMessage: function (msg) {
    // Handle invalid input
    if (!msg || typeof msg !== 'string') {
      return JSON.stringify({ mensaje: '' });
    }

    try {
      var obj = JSON.parse(msg);

      // Validar que el mensaje no contenga inyección de scripts
      if (this.containsScriptInjection(obj.mensaje)) {
        console.log('¡Intento de inyección de script detectado y bloqueado!');
        obj.mensaje = '⚠️ Mensaje bloqueado: Intento de inyección de script detectado';
        return JSON.stringify(obj);
      }

      if (this.is_valid_url_image(obj.mensaje)) {
        console.log("Es una imagen!");
        obj.mensaje = this.getImageTag(obj.mensaje);
      } else if (this.is_valid_video_url(obj.mensaje)) {
        console.log("Es un video!");
        obj.mensaje = this.getEmbeddedCode(obj.mensaje);
      } else {
        console.log("Es un texto!");
        // Sanitizar el texto para prevenir XSS
        obj.mensaje = this.sanitizeText(obj.mensaje);
      }

      return JSON.stringify(obj);
    } catch (e) {
      console.log('Error processing message:', e);
      return JSON.stringify({ mensaje: this.sanitizeText(msg) });
    }
  }

  // fin del modulo
};