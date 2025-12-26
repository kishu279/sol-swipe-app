import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export interface UserDetailsCardProps {
  name: string
  shortname: string
  age: string
  onChange: (field: 'name' | 'shortname' | 'age', value: string) => void
  onNext: () => void
}

export function UserDetailsCard({ name, shortname, age, onChange, onNext }: UserDetailsCardProps) {
  const isComplete = !!name && !!shortname && !!age

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{shortname ? shortname[0].toUpperCase() : 'S'}</Text>
        </View>
        <Text style={styles.title}>USER DETAILS</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formWrap}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={(v) => onChange('name', v)}
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Shortname</Text>
          <TextInput
            style={styles.input}
            placeholder="Your nickname"
            value={shortname}
            onChangeText={(v) => onChange('shortname', v)}
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Your age"
            value={age}
            onChangeText={(v) => onChange('age', v)}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navWrap}>
        <TouchableOpacity
          style={[styles.nextBtn, !isComplete && styles.nextBtnDisabled]}
          onPress={onNext}
          disabled={!isComplete}
        >
          <Text style={styles.nextBtnText}>Next &gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  headerWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  formWrap: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#fafbfc',
  },
  navWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
  },
  nextBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  nextBtnDisabled: {
    backgroundColor: '#b0cfff',
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
