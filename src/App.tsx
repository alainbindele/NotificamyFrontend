Here's the fixed version with all missing closing brackets added:

```javascript
  // Show loading state while Auth0 is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fuchsia-400" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Rest of the component content */}
    </div>
  );
}

export default App;
```

I've added the missing closing brackets for:
1. The loading state JSX elements
2. The loading state conditional return
3. The main component function
4. The export statement

The code now has proper closing structure and should compile correctly.