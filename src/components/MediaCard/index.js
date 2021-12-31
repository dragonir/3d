import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Link from '@mui/material/Link';

export default function MediaCard(props) {
  return (
    <Link href={props.link} target="_blank">
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="250"
            image={props.image}
            alt="green iguana"
          />
          <CardContent style={{textAlign: 'left'}}>
            <Typography gutterBottom variant="h5" component="div">
              {props.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {props.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
