#!/usr/bin/env python
import os
import sys
from PIL import Image
from pathlib import Path

def convert_heic_to_jpg():
    """Convert HEIC image to JPG for web use"""
    try:
        # Copy the source file if it exists in Downloads
        source_heic = Path("c:/Users/hanse/Downloads/IMG_7212.HEIC")
        local_heic = Path("IMG_7212.HEIC")
        
        if source_heic.exists() and not local_heic.exists():
            print(f"Copying {source_heic}...")
            import shutil
            shutil.copy2(source_heic, local_heic)
        
        if not local_heic.exists():
            print(f"ERROR: {local_heic} not found!")
            return False
        
        # Register HEIF opener
        from pillow_heif import register_heif_opener
        register_heif_opener()
        
        # Open and convert
        print(f"Opening HEIC image...")
        img = Image.open(local_heic)
        print(f"Image info: {img.size} {img.mode}")
        
        # Convert to RGB if needed
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                rgb_img.paste(img, mask=img.split()[-1])
            else:
                rgb_img.paste(img)
            img = rgb_img
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Create assets directory
        assets_dir = Path("assets")
        assets_dir.mkdir(parents=True, exist_ok=True)
        
        # Save as JPG with high quality
        output_path = assets_dir / "prototype-components.jpg"
        print(f"Saving to {output_path}...")
        img.save(output_path, 'JPEG', quality=93, optimize=True)
        
        file_size = output_path.stat().st_size
        print(f"✓ Success!")
        print(f"  File: {output_path}")
        print(f"  Size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
        print(f"  Resolution: {img.size[0]}x{img.size[1]}")
        
        # Clean up
        if local_heic.exists():
            os.remove(local_heic)
            print(f"  Cleaned up temporary file")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = convert_heic_to_jpg()
    sys.exit(0 if success else 1)
