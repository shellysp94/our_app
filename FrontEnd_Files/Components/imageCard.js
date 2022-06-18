import React from 'react';
import {Button, Card, Text} from 'react-native-paper';

const ImageCard = props => {
  return (
    <Card
      style={{
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 200,
        height: 300,
      }}>
      <Card.Cover
        style={{marginTop: 20, width: '95%', alignSelf: 'center'}}
        source={{uri: `data:image/gif;base64,${props.source}`}}
      />
      <Card.Actions style={{justifyContent: 'center'}}>
        <Button onPress={() => props.setVisible(false)}>
          <Text>Close</Text>
        </Button>
        <Button>
          {/* FIX ME add option to upload another photo instead */}
          <Text>Update</Text>
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default ImageCard;
