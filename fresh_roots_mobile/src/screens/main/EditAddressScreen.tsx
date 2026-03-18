import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {useAuth} from '../../contexts/AuthContext';
import {authService} from '../../services/api/auth';
import {useTheme} from '../../contexts/ThemeContext';

const MAURITIUS_DISTRICTS = [
  'Black River',
  'Flacq',
  'Grand Port',
  'Moka',
  'Pamplemousses',
  'Plaines Wilhems',
  'Port Louis',
  'Rivière du Rempart',
  'Savanne',
];

interface Props {
  navigation: any;
}

const EditAddressScreen: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {user, refreshUserData} = useAuth();
  const {mode} = useTheme();
  const colors = getColors(mode);

  const [address, setAddress] = useState(user?.delivery_address || '');
  const [district, setDistrict] = useState(user?.delivery_district || '');
  const [city, setCity] = useState(user?.delivery_city || '');
  const [postalCode, setPostalCode] = useState(user?.delivery_postal_code || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);

  const handleSave = async () => {
    if (!address.trim() || !district.trim() || !city.trim()) {
      Alert.alert('Missing Fields', 'Please fill in address, district, and city.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await authService.updateLocation({
        delivery_address: address.trim(),
        delivery_district: district.trim(),
        delivery_city: city.trim(),
        delivery_postal_code: postalCode.trim() || undefined,
      });

      if (response.success) {
        if (refreshUserData) {
          await refreshUserData();
        }
        Alert.alert('Success', 'Delivery address updated.', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error: any) {
      console.error('Update location error:', error);
      Alert.alert('Error', error.message || 'Failed to update address.');
    } finally {
      setIsSaving(false);
    }
  };

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Address Line */}
        <Text style={styles.label}>Street Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 123 Royal Road"
          placeholderTextColor={colors.textLight}
          value={address}
          onChangeText={setAddress}
        />

        {/* District */}
        <Text style={styles.label}>District *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDistrictPicker(!showDistrictPicker)}>
          <Text style={district ? styles.inputText : styles.placeholderText}>
            {district || 'Select district'}
          </Text>
          <Icon name="chevron-down" size={20} color={colors.textLight} />
        </TouchableOpacity>

        {showDistrictPicker && (
          <View style={styles.pickerList}>
            {MAURITIUS_DISTRICTS.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.pickerItem, district === d && styles.pickerItemActive]}
                onPress={() => {
                  setDistrict(d);
                  setShowDistrictPicker(false);
                }}>
                <Text style={[styles.pickerItemText, district === d && styles.pickerItemTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* City */}
        <Text style={styles.label}>City / Town *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Port Louis"
          placeholderTextColor={colors.textLight}
          value={city}
          onChangeText={setCity}
        />

        {/* Postal Code */}
        <Text style={styles.label}>Postal Code (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 11223"
          placeholderTextColor={colors.textLight}
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.saveBtnText}>Save Address</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      padding: spacing.xs,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    content: {
      padding: spacing.lg,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      marginTop: spacing.md,
    },
    input: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderRadius: borderRadius.large,
      padding: spacing.md,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 48,
    },
    inputText: {
      fontSize: 15,
      color: colors.text,
      flex: 1,
    },
    placeholderText: {
      fontSize: 15,
      color: colors.textLight,
      flex: 1,
    },
    pickerList: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.large,
      marginTop: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    pickerItem: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    pickerItemActive: {
      backgroundColor: colors.primary + '15',
    },
    pickerItemText: {
      fontSize: 15,
      color: colors.text,
    },
    pickerItemTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    saveBtn: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.large,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: spacing.xl,
      ...shadows.medium,
    },
    saveBtnDisabled: {
      opacity: 0.7,
    },
    saveBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textInverse,
    },
  });

export default EditAddressScreen;
