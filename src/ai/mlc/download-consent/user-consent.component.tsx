import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/uilib/button.component';
import { Card } from '@/uilib/card.component';
import { Text } from '@/uilib/text.component';

interface Props {
  modelSizeGB: string;
  onAllow(): void;
  onDeny(): void;
}

export const UserConsent: React.FC<Props> = ({ modelSizeGB, onAllow, onDeny }) => (
  <Card style={styles.container}>
    <Text
      style={styles.title}
      category='subheading'>
      {'Download AI Model ✨'}
    </Text>
    <Text style={styles.description}>
      {`This feature requires AI. Allow model download? (≈ ${modelSizeGB})`}
    </Text>
    <Button
      style={styles.allowButton}
      title='Download'
      onPress={onAllow}
    />
    <Button
      style={styles.denyButton}
      type='secondary'
      title='Not now'
      onPress={onDeny}
    />
  </Card>
);

const styles = StyleSheet.create(theme => ({
  container: {
    padding: theme.gap(4),
    margin: theme.gap(3),
  },
  title: {
    marginTop: theme.gap(2),
  },
  description: {
    marginTop: theme.gap(4),
  },
  allowButton: {
    marginTop: theme.gap(8),
  },
  denyButton: {
    marginTop: theme.gap(2),
  },
}));
