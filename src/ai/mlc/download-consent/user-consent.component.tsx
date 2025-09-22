import { StyleSheet } from 'react-native-unistyles';
import { useLingui } from '@lingui/react/macro';

import { Button } from '@/uilib/button.component';
import { Card } from '@/uilib/card.component';
import { Text } from '@/uilib/text.component';

interface Props {
  modelSizeGB: string;
  onAllow(): void;
  onDeny(): void;
}

export const UserConsent: React.FC<Props> = ({ modelSizeGB, onAllow, onDeny }) => {
  const { t } = useLingui();

  return (
    <Card style={styles.container}>
      <Text
        style={styles.title}
        category='subheading'>
        {t`ai.consent.title`}
      </Text>
      <Text style={styles.description}>
        {t`ai.consent.description ${modelSizeGB}`}
      </Text>
      <Button
        style={styles.allowButton}
        title={t`ai.consent.allow_button`}
        onPress={onAllow}
      />
      <Button
        style={styles.denyButton}
        type='secondary'
        title={t`ai.consent.deny_button`}
        onPress={onDeny}
      />
    </Card>
  );
};

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
