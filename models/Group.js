'use strict';
const mongoose = require( 'mongoose' );

var groupSchema = mongoose.Schema( {
  name: String,
  hostemail: String,
  url: String,
  addedUsers: [],
  description: String
} );

module.exports = mongoose.model( 'Group', groupSchema );
