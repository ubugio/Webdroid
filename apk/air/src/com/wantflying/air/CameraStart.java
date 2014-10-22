package com.wantflying.air;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.hardware.Camera.PictureCallback;
import android.hardware.Camera.ShutterCallback;
import android.os.Environment;
import android.util.Log;

public class CameraStart{
	Context mcontext;
    private Camera mCamera;// Camera对象
    private String strCaptureFilePath = Environment.getExternalStorageDirectory() + "/air/";// 保存图像的路径
    private AutoFocusCallback mAutoFocusCallback = new AutoFocusCallback();
	public CameraStart(Context context){
		mcontext = context;
		setup();
	}
	public void shoot(){
        //mCamera.autoFocus(mAutoFocusCallback);// 调用mCamera的
        takePicture();
	}
	public void setup(){
		if (checkCameraHardware(mcontext)) {
            System.out.println("============摄像头存在");// 验证摄像头是否存在
        }

        mCamera = null;
		try {
		    mCamera = Camera.open(0);//打开相机；在低版本里，只有open（）方法；高级版本加入此方法的意义是具有打开多个
		    //摄像机的能力，其中输入参数为摄像机的编号
		    //在manifest中设定的最小版本会影响这里方法的调用，如果最小版本设定有误（版本过低），在ide里将不允许调用有参的
		    //open方法;
		    //如果模拟器版本较高的话，无参的open方法将会获得null值!所以尽量使用通用版本的模拟器和API；
		} catch (Exception e) {
		    Log.e("============", "摄像头被占用");
		}
		if (mCamera == null) {
		    Log.e("============", "摄像机为空");
		    System.exit(0);
		}
		initCamera();
	}
    /* 相机初始化的method */
    private void initCamera() {
        if (mCamera != null) {
            try {
                Camera.Parameters parameters = mCamera.getParameters();
                /*
                 * 设定相片大小为1024*768， 格式为JPG
                 */
                parameters.setPictureFormat(PixelFormat.JPEG);
                parameters.setPictureSize(1024, 768);
                mCamera.setParameters(parameters);
                /* 打开预览画面 */
                //mCamera.startPreview();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    /* 停止相机的method */
    private void stopCamera() {
        if (mCamera != null) {
            try {
                /* 停止预览 */
                //mCamera.release();
                //mCamera = null;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    /* 拍照的method */
    private void takePicture() {
        if (mCamera != null) {
            mCamera.takePicture(shutterCallback, rawCallback, jpegCallback);
        }
    }

    private ShutterCallback shutterCallback = new ShutterCallback() {
        public void onShutter() {
            /* 按下快门瞬间会调用这里的程序 */
        }
    };

    private PictureCallback rawCallback = new PictureCallback() {
        public void onPictureTaken(byte[] _data, Camera _camera) {
            /* 要处理raw data?写?否 */
        }
    };

    //在takepicture中调用的回调方法之一，接收jpeg格式的图像
    private PictureCallback jpegCallback = new PictureCallback() {
        public void onPictureTaken(byte[] _data, Camera _camera) {
            try {
                /* 取得相片 */
                Bitmap bm = BitmapFactory.decodeByteArray(_data, 0,_data.length);

                /* 创建文件 */
                File myCaptureFile = new File(strCaptureFilePath, "1.jpg");
                BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(myCaptureFile));
                /* 采用压缩转档方法 */
                bm.compress(Bitmap.CompressFormat.JPEG, 100, bos);
                /* 调用flush()方法，更新BufferStream */
                bos.flush();
                /* 结束OutputStream */
                bos.close();
                /* 让相片显示3秒后圳重设相机 */
                // Thread.sleep(2000);
                /* 重新设定Camera */
                stopCamera();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };

    /* 自定义class AutoFocusCallback */
    public final class AutoFocusCallback implements android.hardware.Camera.AutoFocusCallback {
        public void onAutoFocus(boolean focused, Camera camera) {
            /* 对到焦点拍照 */
            if (focused) {
                takePicture();
            }
        }
    };
	private boolean checkCameraHardware(Context context) {
        if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)) {
            return true;
        } else {
            return false;
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
