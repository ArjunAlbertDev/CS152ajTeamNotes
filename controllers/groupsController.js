'use strict';
const Groups = require( '../models/group' );
var mongo = require('mongodb');
console.log("loading the Groups Controller")


// this displays all of the groups
exports.getAllGroups = ( req, res ) => {
  console.log('in getAllGroups')
  Groups.find({}) // {hostemail:req.user.googleemail} )
    .exec()
    .then( ( groups ) => {
      res.render( 'groups', {
        groups: groups
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'groups promise complete' );
    } );
};


exports.attachGroups = ( req, res, next ) => {
  console.log('in attachGroups')
  Groups.find( {hostemail:res.locals.user.googleemail} )
    .exec()
    .then( ( groups ) => {
      res.locals.groups = groups
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'attachGroups promise complete' );
    } );
};

exports.getGroupItem = ( req, res, next ) => {
  console.log('in getGroupItem')
  const objId = new mongo.ObjectId(req.params.id)
  Groups.findOne(objId) //{"_id": objId})
    .exec()
    .then( ( groups ) => {
      res.render('groupItem',{e:groups})
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'attachOneGroups promise complete' );
    } );
};




exports.saveGroup = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  let newGroup = new Groups( {
    name: req.body.name,
    hostemail: req.body.hostemail
  } )

  //console.log("skill = "+newSkill)

  newGroup.save()
    .then( () => {
      res.redirect( '/groups' );
    } )
    .catch( error => {
      res.send( error );
    } )
  }

exports.addUser = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  let newGroup = new Groups( {
    name: req.body.name,
    hostemail: req.body.hostemail,
  } )

  //console.log("skill = "+newSkill)

  newGroup.save()
    .then( () => {
      res.redirect( '/groups' );
    } )
    .catch( error => {
      res.send( error );
    } )
  }


exports.deleteGroup = (req, res) => {
  console.log("in deleteGroup")
  let groupName = req.body.groupID
  if (typeof(groupName)=='string') {
      Groups.deleteOne({_id:groupName})
           .exec()
           .then(()=>{res.redirect('/groups')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(groupName)=='object'){
      Groups.deleteMany({_id:{$in:groupName}})
           .exec()
           .then(()=>{res.redirect('/groups')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(groupName)=='undefined'){
      console.log("This is if they didn't select a skill")
      res.redirect('/groups')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown groupName: ${groupName}`)
  }
}

exports.addUser = (req, res) => {
  console.log("in shareGroup")
  let groupName = req.body.groupID
  if (typeof(groupName)=='string') {
      Groups.deleteOne({_id:groupName})
           .exec()
           .then(()=>{res.redirect('/groups')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(groupName)=='object'){
      Groups.deleteMany({_id:{$in:groupName}})
           .exec()
           .then(()=>{res.redirect('/groups')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(groupName)=='undefined'){
      console.log("This is if they didn't select a group")
      res.redirect('/groups')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown groupName: ${groupName}`)
  }
}