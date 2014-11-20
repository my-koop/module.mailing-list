var React = require("react");

var BSCol  = require("react-bootstrap/Col");
var BSRow  = require("react-bootstrap/Row");
var BSGrid = require("react-bootstrap/Grid");
var BSPanel = require("react-bootstrap/Panel");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");

var MailingListAdminPage = React.createClass({

  propTypes: {
    idUser: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      errorMessage: null
    }
  },

  componentWillMount: function () {
    var self = this;
    actions.user.mailinglist({
      data: {
        id: this.props.idUser
      }
    }, function(err, res) {
      var errorMessage = null;
      if(err) {
        errorMessage = {key: "errors::error", context: err.context}
      }
      self.setState({
        errorMessage: errorMessage,
        registeredMailingLists: res || []
      });
    });

    actions.mailinglist.list(function(err, res) {
      var errorMessage = null;
      if(err) {
        errorMessage = {key: "errors::error", context: err.context}
      }
      self.setState({
        errorMessage: errorMessage,
        allMailingLists: res || []
      });
    });
  },

  render: function() {
    var self = this;

    return (
      <div>
      </div>
    );
  }
});

module.exports = MailingListAdminPage;
