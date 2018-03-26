

const handleDomo = function handleDomo(e) {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), () => {
    loadDomosFromServer();
  });

  return false;
};

const DomoForm = function DomoForm(props) {
  return React.createElement(
        'form',
    { id: 'domoForm',
      onSubmit: handleDomo,
      name: 'domoForm',
      action: '/maker',
      method: 'POST',
      className: 'domoForm',
    },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
        ),
        React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
        React.createElement(
            'label',
            { htmlFor: 'age' },
            'Age: '
        ),
        React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { classNam: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
    );
};

const DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
            'div',
            { className: 'domoList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No Domos yet'
            )
        );
  }

  const domoNodes = props.domo.map((domo) => React.createElement(
            'div',
            { key: domo._id, className: 'domo' },
            React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
            React.createElement(
                'h3',
                { className: 'domoName' },
                ' Name: ',
                domo.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'domoAge' },
                ' Age: ',
                domo.age,
                ' '
            )
        ));

  return React.createElement(
        'div',
        { className: 'domoList' },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector('#domos'));
  });
};

const setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf }), document.querySelector('#makeDomo'));

  ReactDOM.render(React.createElement(DomoForm, { domos: [] }), document.querySelector('#domos'));

  loadDomosFromServer();
};

const getToken = function getToken() {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(() => {
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('domoMessage').animate({ width: 'toggle' }, 350);
};

const redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type,
    url: action,
    data,
    dataType: 'json',
    success,
    error: function error(xhr, status, _error) {
      const messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    },
  });
};
