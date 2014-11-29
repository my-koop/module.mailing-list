var React = require('react');

var BSCol   = require("react-bootstrap/Col");
var BSPanel = require("react-bootstrap/Panel");

var MailingListConfig = React.createClass({

  componentWillMount: function () {

  },

  render: function () {
    return (
      <BSCol md={6}>
        <BSPanel>
          MailingListConfig
        </BSPanel>
      </BSCol>
    );
  }
});

module.exports = MailingListConfig;
